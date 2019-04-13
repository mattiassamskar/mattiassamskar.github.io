import React, { FunctionComponent, useEffect, useState } from "react";
import { init, animate } from "./index";
import "./starsContainer.css";

export const StarsContainer: FunctionComponent = () => {
  const [ref, setRef] = useState();

  useEffect(() => {
    if (!ref) return;
    init(ref);
    animate();
  }, [ref]);

  return <div ref={setRef} className="container" />;
};
