import { useMount } from "ahooks";
import { createElement, MutableRefObject } from "react";

export interface DivContainerProps {
  wrapperRef: MutableRefObject<any>;
  containerRef: MutableRefObject<any>;
  ready: () => void;
}
export default function DivContainer(props: DivContainerProps) {
  useMount(() => {
    props.ready();
  });
  return (
    <div className="mxcn-resize-wrapper" ref={props.wrapperRef}>
      <div className="mxcn-resize" ref={props.containerRef}></div>
    </div>
  )
}
