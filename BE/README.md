# Tài liệu API

## Tổng quan
Tài liệu này sẽ cung cấp đầy đủ thông tin API cũng như cách sử dụng API của các chức năng hiện có trong dự án.

## Nội dung
1. [Authentication](#authentication)
2. [Sản phẩm](#product-management)
3. [Danh mục](#category-management)
4. [Thương hiệu](#brand-management)
5. [Giỏ hàng](#cart-management)
6. [Tài khoản](#account-management)
7. [Thông tin người dùng](#profile-management)
8. [Địa chỉ](#address-management)

---

## Authentication

### 1. Đăng ký
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
    {
        "fullName": "",
        "phoneNumber": "",
        "dateOfBirth": "yyyy-mm-dd",
        "email": "",
        "password": "",
        "role": "Admin/Member"
    }

### 2. Đăng nhập
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
    {
        "email": "",
        "password": ""
    }

## Sản phẩm

### 1. Thêm sản phẩm (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/products`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
- **Request Body:**
  ```json
    {
        "name": "",
        "price": "xx,xxx,xxx",
        "status": "",
        "brand": "<id>",
        "category": "<id>>",
        "description": "",
        "images": ["Hình 1", "Hình 2", "Hình 3", "Hình ...."]
    }

### 2. Xem tất cả sản phẩm
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/products/public`
- **Headers:** `Content-Type: application/json`

### 3. Xem sản phẩm theo danh mục 
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/products/public/category/<category-id>`
- **Headers:** `Content-Type: application/json`

### 4. Cập nhật sản phẩm (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/products/<product-id>`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
- **Request Body:**
  ```json
    {
        "name": "",
        "price": "xx,xxx,xxx",
        "status": "",
        "brand": "<brand-id>",
        "category": "<category-id>>",
        "description": "",
        "images": ["Hình 1", "Hình 2", "Hình 3", "Hình ...."]
    }

### 5. Xóa sản phẩm (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/products/<product-id>`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`

## Danh mục

### 1. Thêm danh mục (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/categories`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
- **Request Body:**
  ```json
    {
        "name": "",
        "description": ""
    }

### 2. Cập nhật danh mục (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/categories/<category-id>`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
- **Request Body:**
  ```json
    {
        "name": "",
        "description": ""
    }

### 3. Xem tất cả danh mục
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/categories/public`
- **Headers:** `Content-Type: application/json`

### 4. Xóa danh mục (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/categories/<category-id>`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`

## Thương hiệu

### 1. Thêm thương hiệu (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/brands`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
- **Request Body:**
  ```json
    {
        "name": ""
    }

### 2. Chỉnh sửa thương hiệu (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/brands/<brand-id>`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
- **Request Body:**
  ```json
    {
        "name": ""
    }

### 3. Xem danh sách thương hiệu
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/brands`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`

### 4. Xóa thương hiệu
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/brands/<brand-id>`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`

## Giỏ hàng

### 1. Thêm vào giỏ hàng (Member)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/cart/add`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
- **Request Body:**
  ```json
    {
      "productId": "<product-id>",
      "quantity": 
    }

### 2. Xem giỏ hàng (Member)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/cart`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`

### 3. Xóa sản phẩm trong giỏ hàng (Member)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/cart/remove`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
- **Request Body:**
  ```json
    {
      "productId": "<product-id>" 
    }

## Tài khoản

### 1. Xem danh sách tất cả tài khoản (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`

### 2. Xem thông tin của tài khoản theo ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/<account-id>`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`

### 3. Xóa tài khoản (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/users/<account-id>`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`

### 4. Chỉnh sửa thông tin tài khoản (Member)
- **Method:** `PUT`
- **URL:** `hhttp://localhost:5000/api/users/<account-id>`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
- **Request Body:**
  ```json
    {
      "fullName": "",
      "phoneNumber": "",
      "dateOfBirth": ""
    }

## Thông tin người dùng

### 1. Thông tin cá nhân (Member)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/me`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`

### 2. Cập nhật thông tin cá nhân (Member)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/users/me`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
- **Request Body:**
  ```json
    {
      "fullName": "",
      "phoneNumber": "",
      "dateOfBirth": ""
    }

## Địa chỉ

### 1. Thêm địa chỉ (Member)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/addresses`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
- **Request Body:**
  ```json
    {
      "name": "",
      "address": "",
      "isDefault": true/false
    }

### 2. Danh sách địa chỉ (Member)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/addresses`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`

### 3. Xóa địa chỉ (Member)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/addresses/<address-id>`
- **Headers:** `Content-Type: application/json`, `x-auth-token: <token>`
