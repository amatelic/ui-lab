## Motion

Staggering means to slightly delay the movement of an element based on their order in the group. We use the index property from a loop for this:


```js
.map((item, index) => {
  return (
    <motion.div
      key={index}
      transition={{
        delay: index * 0.05,
      }}
    />
  )
})
```

Open ai is using staggering for showing new items??
- but maybe use this only for the first section of items.
