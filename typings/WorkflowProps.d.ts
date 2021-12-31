/**
 * This file was generated from Workflow.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Team
 */
import { CSSProperties } from "react";
import { EditableValue } from "mendix";

interface CommonProps {
    name: string;
    class: string;
    tabIndex: number;

    uniqueid: string;
    friendlyId?: string;
    mxform: mxui.lib.form._FormBase;
    mxObject?: mendix.lib.MxObject;
    style: string;
}

export interface WorkflowContainerProps extends CommonProps {
    myString: string;
}

export interface WorkflowPreviewProps {
    class: string;
    style: string;
    styleObject: CSSProperties;
    myString: string;
}

export interface VisibilityMap {
    myString: boolean;
}
