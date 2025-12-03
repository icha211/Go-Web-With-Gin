package models

type AlbumTag struct {
    TagID   uint `gorm:"primaryKey"`
    AlbumID uint `gorm:"primaryKey"`
}