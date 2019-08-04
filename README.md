# users-auth

#### APIs

#### liveness

curl http://localhost:3000/

##### /user/signup

curl -H "Content-Type: application/json" -X POST \
-d '{"name":"xyz","password":"password","email":"abc@xyz.com"}' \
http://localhost:3000/api/v1/user/signup

##### /user/signin

curl -H "Content-Type: application/json" -X POST -d '{"email":"abc@xyz.com","password":"password"}' \
http://localhost:3000/api/v1/user/signin


##### /user/profile

curl -H "Authorization: Bearer <ACCESS_TOKEN>" -X GET http://localhost:3000/api/v1/user/profile

##### /user/profile/update

curl -i -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS_TOKEN>" \
-X PUT -d '{"name":"xyz","password":"password"}' \
http://localhost:3000/api/v1/user/profile/update