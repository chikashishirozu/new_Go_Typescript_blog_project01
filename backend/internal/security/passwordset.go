func GenerateFirstAdminPassword() string {
//    pwd, _ := password.Generate(16, 4, 0, false, false)
    pwd, err := password.Generate(16, 4, 0, false, false)
    if err != nil {
        log.Fatal(err)
    }
    
    log.Printf("Admin password: %s (保存してください)", pwd)
    return pwd
}
