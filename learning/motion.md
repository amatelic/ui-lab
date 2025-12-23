## Motion

### Exit animations

```js

export const MyComponent = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
    ) : null}
  </AnimatePresence>
)
```


```js

import { motion } from "framer-motion";
import { useState } from "react";

export default function Example() {
  const [showSecond, setShowSecond] = useState(false);

  return (
    <motion.div  className="wrapper">
    {/* Only here we need the layout for the animation */}
      <motion.button layout className="button" onClick={() => setShowSecond((s) => !s)}>
        Animate
      </motion.button>
      {showSecond ? (
        <motion.div layoutId="tab-indicator" className="second-element" />
      ) : (
        <motion.div layoutId="tab-indicator" className="element" />
      )}
    </motion.div>
  );
}

```
