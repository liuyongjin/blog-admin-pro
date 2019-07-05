import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
const marked=require('marked');
import Editor from 'for-editor';

interface MarkdownEditorProps extends FormComponentProps {
    value?: string;
    onChange?: any;
}

export interface MarkdownEditorState {
    value: string;
}

class MarkdownEditor extends Component<MarkdownEditorProps, MarkdownEditorState> {
    static defaultProps = {

    };

    constructor(props: MarkdownEditorProps) {
        super(props);
        this.state = {
            value: props.value || ''
        }
    }

    triggerChange = (changedValue: string) => {
        this.setState({
            value: changedValue
        })

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }
    }


    render() {
        const { value } = this.state
        return (
            <Editor value={value} onChange={this.triggerChange} />
        );
    }
}
export default MarkdownEditor;
