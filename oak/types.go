package main

type OakUser struct {
	Id       uint64 `json:"id"`
	Username string `json:"username"`
}

type OakObject struct {
	Id     uint64 `json:"id" db:"id"`
	Parent string `json:"parent" db:"parent"`
	Name   string `json:"name" db:"name"`
	IsFile bool   `json:"isFile" db:"is_file"`
}

type OakFile struct {
	Id          uint64 `json:"id" db:"id"`
	Content     string `json:"content" db:"content"`
	Version     int    `json:"version" db:"version"`
	IsCommitted bool   `json:"isCommitted" db:"is_committed"`
}

type OakObjectFile struct {
	Id       uint64 `json:"id"`
	ObjectId uint64 `json:"objectId"`
	FileId   uint64 `json:"fileId"`
}
