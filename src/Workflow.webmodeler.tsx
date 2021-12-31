import { Component, ReactNode, createElement } from "react";
import { WorkflowContainerProps, WorkflowPreviewProps } from "../typings/WorkflowProps";

declare function require(name: string): string;

export class preview extends Component<WorkflowPreviewProps> {
    render(): ReactNode {
        return <div>No preview available</div>;
    }
}

export function getPreviewCss(): string {
    return require("./ui/Workflow.scss");
}
type VisibilityMap = {
    [P in keyof WorkflowContainerProps]: boolean;
};


export function getVisibleProperties(props: WorkflowContainerProps, visibilityMap: VisibilityMap): VisibilityMap {
    // visibilityMap.nodeConstraint = props.nodeDataSource === "xpath";
    // visibilityMap.nodeGetDataMicroflow = props.nodeDataSource === "microflow";
    // visibilityMap.nodeGetDataNanoflow = props.nodeDataSource === "nanoflow";
    console.log(props);
    

    return visibilityMap;
}