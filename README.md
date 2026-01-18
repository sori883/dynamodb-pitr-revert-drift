# エクスポート

```
aws dynamodb export-table-to-point-in-time \
    --table-arn arn:aws:dynamodb:ap-northeast-1:123456789012:table/YourTableName \
    --s3-bucket your-bucket-name \
    --s3-prefix dynamodb-export/ \
    --export-format DYNAMODB_JSON
```

# インポート

```
aws dynamodb import-table \
    --s3-bucket-source S3Bucket=your-bucket-name,S3KeyPrefix=dynamodb-export/ \
    --input-format DYNAMODB_JSON \
    --input-compression-type GZIP \
    --table-creation-parameters '{
        "TableName": "NewTableName",
        "KeySchema": [
            {"AttributeName": "id", "KeyType": "HASH"}
        ],
        "AttributeDefinitions": [
            {"AttributeName": "id", "AttributeType": "S"}
        ],
        "BillingMode": "PAY_PER_REQUEST"
    }'
```
aws dynamodb import-table \
    --s3-bucket-source S3Bucket=dev-infra-bucket83908e77-bs8s8iowqe4e,S3KeyPrefix=dynamodb-export/AWSDynamoDB/01768581400663-f987cd2d/data/ \
    --input-format DYNAMODB_JSON \
    --input-compression-type GZIP \
    --table-creation-parameters '{
        "TableName": "dev-infra-TableCD117FA1-3U4B4Y0DW9OY",
        "KeySchema": [
            {"AttributeName": "id", "KeyType": "HASH"}
        ],
        "AttributeDefinitions": [
            {"AttributeName": "id", "AttributeType": "S"}
        ],
        "BillingMode": "PAY_PER_REQUEST"
    }' --profile AdministratorAccess-242201303782 --region ap-northeast-1