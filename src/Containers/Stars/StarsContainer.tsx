import React, { FunctionComponent, useEffect, useState } from "react";
import { init, animate } from "./index";

export const StarsContainer: FunctionComponent = () => {
  const [ref, setRef] = useState();

  useEffect(() => {
    if (!ref) return;
    init(ref);
    animate();
  }, [ref]);

  return <div ref={setRef} style={{ width: "100%", height: 500 }} />;
};
