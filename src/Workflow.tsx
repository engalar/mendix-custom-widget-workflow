import { createElement, useState } from "react";


import { WorkflowContainerProps } from "../typings/WorkflowProps";

import "./ui/Workflow.scss";

import { Store } from "./store";
import { WorkflowComponent } from "./components/WorkflowComponent";


export default function Workflow(props: WorkflowContainerProps) {
    console.log(props);

    const [store] = useState(new Store());

    return <WorkflowComponent store={store} />
}
