## 作业1:

![image-20230405160749154](image-20230405160749154.png)

### netsh winhttp set proxy 127.0.0.1:7777

![image-20230405171101462](image-20230405171101462.png

![image-20230405175054726](image-20230405175054726.png)

## 作业2:

![image-20230405171209632](image-20230405171209632.png)

```
select 
DATE_TRUNC('day',minute) as day,
avg(price) as avg_price
from prices."usd"  
where 
"symbol"='USDC' 
and "blockchain"='ethereum' 
and "contract_address"=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 
and DATE_TRUNC('day',minute) > DATE_TRUNC('day',NOW()) - INTERVAL '30' day
group by DATE_TRUNC('day',minute) order by day
```

![image-20230405174147045](image-20230405174147045.png)

![image-20230405174154037](image-20230405174154037.png)