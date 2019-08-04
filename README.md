# users-auth

#### APIs

#### liveness
```bash
curl http://localhost:3000/
```

##### /user/signup
```bash
curl -H "Content-Type: application/json" -X POST \
-d '{"name":"xyz","password":"password","email":"abc@xyz.com"}' \
http://localhost:3000/api/v1/user/signup
```

##### /user/signin
```bash
curl -H "Content-Type: application/json" -X POST -d '{"email":"abc@xyz.com","password":"password"}' \
http://localhost:3000/api/v1/user/signin
```


##### /user/profile
```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" -X GET http://localhost:3000/api/v1/user/profile
```
##### /user/profile/update
```bash
curl -i -H "Content-Type: application/json" \
-X PUT -d '{"name":"xyz","password":"password"}' \
http://localhost:3000/api/v1/user/profile/update
```