package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"

	// "log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	// "github.com/jmoiron/sqlx"
)

type Configuration struct {
	Debug         bool   `json:"debug"`
	MysqlHost     string `json:"mysqlHost"`
	MysqlPort     string `json:"mysqlPort"`
	MysqlUsername string `json:"mysqlUsername"`
	MysqlPassword string `json:"mysqlPassword"`
	OakPassword   string `json:"oakPassword"`
}

func CheckEmpty(fieldname string, value string) {
	if len(value) == 0 {
		panic(fmt.Sprintf("invalid config: '%s' is empty", fieldname))
	}
}

func AuditConfig() {
	CheckEmpty("MysqlHost", config.MysqlHost)
	CheckEmpty("MysqlPort", config.MysqlPort)
	CheckEmpty("MysqlUsername", config.MysqlUsername)
}

var config *Configuration

func Check(err error) {
	if err != nil {
		panic(err)
	}
}

func ProduceBaseConfigJsonAndPanic() {
	bytes, err := json.MarshalIndent(Configuration{}, "", "  ")
	Check(err)
	panic(string(bytes))
}

func ParseConfig(configPath string) {
	cfg := &Configuration{}
	bytes, err := ioutil.ReadFile(configPath)
	if err != nil {
		ProduceBaseConfigJsonAndPanic()
	}
	err = json.Unmarshal(bytes, cfg)
	if err != nil {
		ProduceBaseConfigJsonAndPanic()
	}
	config = cfg
}

func OakConfigure() {
	args := os.Args[1:]
	if len(args) < 1 {
		ProduceBaseConfigJsonAndPanic()
	}
	ParseConfig(args[0])
	AuditConfig()
}

func MysqlConnectionString() string {
	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/oak",
		config.MysqlUsername,
		config.MysqlPassword,
		config.MysqlHost,
		config.MysqlPort,
	)
}

func main() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
		}
	}()
	OakConfigure()

	db, err := sqlx.Connect("mysql", MysqlConnectionString())
	if err != nil {
		log.Panicln(err)
	}
	err = db.Ping()
	Check(err)

	var ginMode string
	if config.Debug {
		ginMode = gin.DebugMode
	} else {
		ginMode = gin.ReleaseMode
	}
	gin.SetMode(ginMode)

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// /objects?path=/insurance
	r.GET("/objects", func(ctx *gin.Context) {
		path := ctx.Query("path")
		if len(path) == 0 {
			path = "/"
		}
		var objs []Object
		sql := `select id, parent, name, is_json from object where parent = ?`
		stmt, err := db.Preparex(sql)
		Check(err)
		err = stmt.Select(&objs, path)
		Check(err)
		ctx.JSON(200, objs)
	})

	// /content?object=2
	r.GET("/content", func(ctx *gin.Context) {
		objectId := ctx.Query("object")
		if objectId == "" {
			ctx.JSON(400, map[string]string{"message": "bad request"})
			return
		}
		var content Json
		sql := `select j.id, content from object_json
		join json j on j.id = object_json.json_id
		where object_id = ?`
		stmt, err := db.Preparex(sql)
		Check(err)
		err = stmt.Get(&content, objectId)
		Check(err)
		ctx.JSON(200, content)
	})

	err = r.Run()
	Check(err)
}

type User struct {
	Id       uint64 `json:"id"`
	Username string `json:"username"`
}

type Object struct {
	Id     uint64 `json:"id" db:"id"`
	Parent string `json:"parent" db:"parent"`
	Name   string `json:"name" db:"name"`
	IsJson bool   `json:"isJson" db:"is_json"`
}

type Json struct {
	Id      uint64 `json:"id"`
	Content string `json:"content"`
}

type ObjectJson struct {
	Id       uint64 `json:"id"`
	ObjectId uint64 `json:"objectId"`
	JsonId   uint64 `json:"jsonId"`
}
