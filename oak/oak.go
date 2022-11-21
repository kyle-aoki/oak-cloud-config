package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"math/rand"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	// "log"
	"net/http"
)

var db *sqlx.DB

func InitializeDb() {
	database := Must(sqlx.Connect("mysql", MysqlConnectionString()))
	db = database
}

func main() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
		}
	}()
	OakConfigure()
	InitializeDb()

	if config.Debug {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
		gin.DefaultErrorWriter = ioutil.Discard
	}

	engine := gin.Default()
	engine.Use(cors.Default())

	engine.Use(func(ctx *gin.Context) {
		n := rand.Intn(1000)
		if n < 500 {
			n += 500
		}
		time.Sleep(time.Millisecond * time.Duration(n))
		ctx.Next()
	})

	engine.Use(gin.CustomRecovery(func(ctx *gin.Context, err any) {
		ctx.JSON(400, map[string]any{"err": err})
	}))

	engine.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	// /objects?parent=/insurance
	engine.GET("/objects", func(ctx *gin.Context) {
		parent := ctx.Query("parent")
		if len(parent) == 0 {
			parent = "/"
		}
		objs := []OakObject{}
		stmt := Must(db.Preparex(`SELECT id, parent, name, is_file FROM object WHERE parent = ?`))
		Check(stmt.Select(&objs, parent))
		ctx.JSON(200, objs)
	})

	// /content?object=2
	engine.GET("/content", func(ctx *gin.Context) {
		objectId := ctx.Query("object")
		if objectId == "" {
			ctx.JSON(400, map[string]string{"message": "bad request"})
			return
		}
		var oakFile OakFile
		sql := `SELECT file.id, file.content, file.version, file.is_committed
		FROM object_file JOIN file ON file.id = object_file.file_id
		WHERE object_id = ?`
		stmt, err := db.Preparex(sql)
		Check(err)
		err = stmt.Get(&oakFile, objectId)
		Check(err)
		ctx.JSON(200, oakFile)
	})

	engine.POST("/upgrade", func(ctx *gin.Context) {
		var oakFile OakFile
		err := ctx.BindJSON(&oakFile)
		Check(err)
		sql := `
			UPDATE file
			SET content      = ?,
				is_committed = TRUE,
				version      = ?
			WHERE file.id = ?;`
		stmt, err := db.Preparex(sql)
		Check(err)
		res, err := stmt.Exec(oakFile.Content, oakFile.Version, oakFile.Id)
		Check(err)
		_, err = res.RowsAffected()
		Check(err)
		ctx.JSON(200, nil)
	})

	engine.POST("/new-file", func(ctx *gin.Context) {
		var oakObject OakObject
		Check(ctx.BindJSON(&oakObject))
		if len(oakObject.Name) == 0 {
			panic("invalid file name")
		}
		if !oakObject.IsFile {
			panic("cannot create folder in new-file route")
		}
		tx := TxBegin()
		objectId := Exec(tx,
			`INSERT INTO object (parent, name, is_file) VALUES (?, ?, TRUE)`,
			oakObject.Parent,
			oakObject.Name,
		)
		fileId := Exec(tx, `INSERT INTO file (content, version, is_committed) VALUES ('', 0, TRUE)`)
		Exec(tx,
			`INSERT INTO object_file (object_id, file_id) VALUES (?, ?)`,
			objectId,
			fileId,
		)
		oakObject.Id = uint64(objectId)
		TxCommit(tx)
		ctx.JSON(200, oakObject)
	})

	engine.POST("/new-folder", func(ctx *gin.Context) {
		var oakObject OakObject
		Check(ctx.BindJSON(&oakObject))
		if len(oakObject.Name) == 0 {
			panic("invalid folder name")
		}
		if oakObject.IsFile {
			panic("cannot create file in new folder route")
		}
		stmt := Must(db.Preparex(`INSERT INTO object (parent, name, is_file) VALUES (?, ?, FALSE)`))
		res := Must(stmt.Exec(oakObject.Parent, oakObject.Name))
		objectId := Must(res.LastInsertId())
		oakObject.Id = uint64(objectId)
		ctx.JSON(200, oakObject)
	})

	Check(engine.Run())
}

func TxBegin() *sqlx.Tx {
	return Must(db.BeginTxx(context.Background(), nil))
}

func TxCommit(tx *sqlx.Tx) {
	Check(tx.Commit())
}

func Exec(tx *sqlx.Tx, sql string, args ...any) int64 {
	stmt1 := Must(tx.Preparex(sql))
	res := Must(stmt1.Exec(args...))
	return Must(res.LastInsertId())
}
