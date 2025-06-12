
```
GET /selected-stocks
```

#### Tham số truy vấn

| Tham số | Loại  | Mặc định | Mô tả                                      |
| ------- | ------ | ------- | ------------------------------------------ |
| page    | number | 1       | Số trang                                   |
| limit   | number | 10      | Số lượng mục trên mỗi trang                |
| sort    | string | 'symbol'| Trường để sắp xếp (symbol, close, return, volume) |
| order   | string | 'asc'   | Thứ tự sắp xếp ('asc' hoặc 'desc')        |

#### Phản hồi

```json
{
  "message": "Lấy danh sách cổ phiếu được chọn thành công",
  "data": [
    {
      "id": "uuid-string",
      "symbol": "VNM",
      "close": 86000,
      "return": 0.05,
      "volume": 1200000,
      "createdAt": "2023-06-01T00:00:00.000Z",
      "updatedAt": "2023-06-01T00:00:00.000Z",
      "stockInfo": {
        "id": "uuid-string",
        "symbol": "VNM",
        "name": "Công ty Cổ phần Sữa Việt Nam",
        "exchange": "HOSE",
        "industry": "Thực phẩm và đồ uống"
      },
      "stockPrices": [
        {
          "date": "2023-06-01T00:00:00.000Z",
          "close": 86000
        },
        {
          "date": "2023-05-31T00:00:00.000Z",
          "close": 85500
        },
        // Các giá đóng cửa khác trong 3 tháng gần đây
      ]
    },
    // Các cổ phiếu khác
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```