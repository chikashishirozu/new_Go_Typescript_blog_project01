package main

import (
    "fmt"
    "log"

    "github.com/sethvargo/go-password/password"
)

func main() {
    pwd, err := password.Generate(16, 4, 0, false, false)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Print(pwd)
}
