import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';

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
        // if (!('value' in this.props)) {
        //     this.setState({
        //         value: changedValue
        //     })
        // }
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }
    }

    // componentWillReceiveProps(nextProps: MarkdownEditorProps) {
    //     console.log(this)
    //     // Should be a controlled component.
    //     if ('value' in nextProps) {
    //         const value:any = nextProps.value;
    //         this.setState({ value: value });
    //     }
    // }

    render() {
        const { value } = this.state
        return (
            <Editor value={value} onChange={this.triggerChange} />
        );
    }
}
export default MarkdownEditor;
