package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type Configuration struct {
	Debug         bool   `json:"debug"`
	MysqlHost     string `json:"mysqlHost"`
	MysqlPort     string `json:"mysqlPort"`
	MysqlUsername string `json:"mysqlUsername"`
	MysqlPassword string `json:"mysqlPassword"`
	OakPassword   string `json:"oakPassword"`
}

func CheckEmpty(fieldName string, value string) {
	if len(value) == 0 {
		panic(fmt.Sprintf("invalid config: '%s' is empty", fieldName))
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

func CheckFn(err error, fn func() string) {
	if err != nil {
		panic(fn())
	}
}

func ProduceBaseConfigJsonAndPanic() string {
	bytes, err := json.MarshalIndent(Configuration{}, "", "  ")
	Check(err)
	return string(bytes)
}

func ParseConfig(configPath string) {
	cfg := &Configuration{}
	bytes, err := ioutil.ReadFile(configPath)
	CheckFn(err, ProduceBaseConfigJsonAndPanic)
	err = json.Unmarshal(bytes, cfg)
	CheckFn(err, ProduceBaseConfigJsonAndPanic)
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
