# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      | home.tsx view.tsx  | none              | none         |
| Register new user<br/>(t@jwt.com, pw: test) (uses loginUser())        | register.tsx view.tsx home.tsx| [POST] '/auth/'        | addUser() `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`   |
| Login new user<br/>(t@jwt.com, pw: test)   (uses loginUser()) | login.tsx home.tsx | [PUT] '/auth/'         | getUser() `SELECT * FROM user WHERE email=?`   |
| Order pizza  (uses isLoggedIn() )                    | menu.tsx  payments.tsx delivery.tsx| [GET] '/order/menu/' [GET] '/franchise/' [POST] '/order/ | getMenu() `SELECT * FROM menu` getFranchises() `SELECT id, name FROM franchise` addDinerOrder() `INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now())`|
| Verify pizza                                        | delivery.tsx       | none              | none         |
| View profile page  (uses isLoggedIn())              | dinerDashboard.tsx | [GET] '/order'   | getOrders() `SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT ${offset},${config.db.listPerPage}`              |
| View franchise<br/>(as diner) (uses isLoggedIn())    |  franchiseDashboard.tsx| [GET] '/franchise/:userId' | getUserFranchises() `SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?`              |
| Logout (uses isLoggedIn())                          |  logout.tsx        | [DELETE] '/auth/' | logoutUser() `DELETE FROM auth WHERE token=?`             |
| View About page                                     |  about.tsx         | none              | none         |
| View History page                                   | history.tsx        | none              | none         |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) (uses loginUser()) | login.tsx home.tsx | [PUT] '/auth'/    | getUser() `SELECT * FROM user WHERE email=?` loginUser() `INSERT INTO auth (token, userId) VALUES (?, ?)`     |
| View franchise<br/>(as franchisee) (uses isLoggedIn())    | franchiseDashboard.tsx     | [GET] '/franchise/:userId'   |  getUserFranchises() `SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?` getFranchise() `SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee'`     |
| Create a store   (uses isLoggedIn())                |  creatStore.tsx    | [POST] '/franchise/:franchiseId/store' [GET] '/franchise/:userId | getFranchise() `SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee'` createStore() `INSERT INTO store (franchiseId, name) VALUES (?, ?)` getUserFranchises() `SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?`              |
| Close a store  (uses isLoggedIn())                  | closeStore.tsx franchiseDashboard.tsx     | [DELETE] '/franchise/:franchiseId/store/:storeId' [GET] '/franchise/:userId' | deleteStore() `DELETE FROM store WHERE franchiseId=? AND id=?` getFranchise() `SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee'`  getUserFranchises() `SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?`           |
| Login as admin<br/>(a@jwt.com, pw: admin) (uses loginUser())          | login.tsx home.tsx | [PUT] '/auth/      | getUser() `SELECT * FROM user WHERE email=?` loginUser() `INSERT INTO auth (token, userId) VALUES (?, ?)`  |  
| View Admin page (uses isLoggedIn())                 | adminDashboard.tsx | [GET] '/franchise'   | getFranchises() `SELECT id, name FROM franchise`             |
| Create a franchise for t@jwt.com  (uses isLoggedIn())| createFranchise.tsx adminDashboard.tsx| [POST] '/franchise' [GET] '/franchise'| createFranchise() `INSERT INTO franchise (name) VALUES (?)` getFranchises() `SELECT id, name FROM franchise`            |
| Close the franchise for t@jwt.com   (uses isLoggedIn())   | closeFranchise.tsx | [DELETE] '/franchise/:franchiseId [GET] '/franchise'  | deleteFranchise() `SELECT id, name FROM franchise` `DELETE FROM userRole WHERE objectId=?` `DELETE FROM franchise WHERE id=?` getFranchises() `SELECT id, name FROM franchise`              |

loginUser() happens for several of these activities and uses this SQL to add the new auth token: `INSERT INTO auth (token, userId) VALUES (?, ?)`.
isLoggedIn() is also used for several activities (as indicated) as uses this SQL to check: `SELECT userId FROM auth WHERE token=?`