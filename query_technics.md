## Variables

```
query ($name: String!) {
  user(name: $name) {
    id
    name
  }
}

// Variable
{
  "name": "Rebecca"
}
```

```
query ($unit: WeightUnit){
   users {
    friends {
      id
      name
      age
      weight(unit: $unit)
    }
  }
}

// Variable
{
  "uuuu": "POUND"
}
```

## Operation Name

```
query OperationName {
  ...
}

mutation OperationName {
  ...
}
```

1. 增加可讀性、表達性
2. 若一次執行多筆 operation， Query Name 有助於區分各個 operation
3. 有名字才好找問題！當你在 debug 或是效能追蹤時，就會發現名字的妙用！
4. 對 client 端來說， Operaion Name 讓管理 query 更易讀、方便

## Aliases

```
query UserData($name1: String!, $name2: String!, $name3: String!) {
  user1: user(name: $name1) {
    id
    name
  },
  user2: user(name: $name2) {
    id
    name
  },
  user3: user(name: $name3) {
    id
    name
  },
}
// Variables 
{
  "name1": "Rebecca",
  "name2": "Sandy",
  "name3": "Nathalie"
}
```

**Server Response**

```
{
  "data": {
    "user1": {
      "id": "1",
      "name": "Rebecca"
    },
    "user2": {
      "id": "2",
      "name": "Sandy"
    },
    "user3": {
      "id": "3",
      "name": "Nathalie"
    }
  }
}
```

## Fragments

```
query {
  user1: user(name: "Rebecca") {
    ...userData
  }
  user2: user(name: "Sandy") {
    ...userData
  }
}

fragment userData on User {
  id
  name
}
```

**Server Response**

```
{
  "data": {
    "user1": {
      "id": "1",
      "name": "Rebecca"
    },
    "user2": {
      "id": "2",
      "name": "Sandy"
    }
  }
}
```

