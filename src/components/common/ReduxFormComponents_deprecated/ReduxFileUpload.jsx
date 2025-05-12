import React from 'react';
import PropTypes from 'prop-types';

import { FileUpload, FormGroup } from '@patternfly/react-core';

import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';

import PopoverHint from '../PopoverHint';

class ReduxFileUpload extends React.Component {
  state = {
    filename: '',
  };

  componentDidMount() {
    // added because the FileUpload component does not forward additional props
    // like placeholder and onBlur to the TextArea
    // https://github.com/patternfly/patternfly-react/issues/7004
    const {
      placeholder,
      input: { name },
    } = this.props;
    document.getElementById(name).addEventListener('blur', this.onTextAreaBlur);
    if (placeholder) {
      document.getElementById(name).setAttribute('placeholder', placeholder);
    }
  }

  componentWillUnmount() {
    const {
      input: { name },
    } = this.props;
    document.getElementById(name)?.removeEventListener('blur', this.onTextAreaBlur);
  }

  onTextAreaBlur = (event) => {
    const {
      input: { onBlur },
    } = this.props;
    onBlur(event);
  };

  handleFileChange = (_e, file) => {
    const { input } = this.props;
    this.setState({
      filename: file.name,
    });
    input.onChange(file);
  };

  handleFileContentChange = (_e, value) => {
    const { input } = this.props;
    input.onChange(value);
  };

  handleFileRejected = (rejectedFiles, event) => {
    const {
      input: { onBlur },
      dropzoneProps,
    } = this.props;
    // makes the input touched so that the validation error message is displayed
    onBlur();
    if (dropzoneProps && dropzoneProps.onDropRejected) {
      dropzoneProps.onDropRejected(rejectedFiles, event);
    }
  };

  handleClear = () => {
    const { input } = this.props;
    input.onChange('');

    this.setState({ filename: '' });
  };

  render() {
    const {
      helpText,
      meta: { error, dirty, touched },
      input: { name, value },
      isRequired,
      label,
      extendedHelpTitle,
      extendedHelpText,
      dropzoneProps,
    } = this.props;
    const { filename } = this.state;

    return (
      <FormGroup
        fieldId={name}
        label={label}
        labelIcon={
          extendedHelpText && <PopoverHint title={extendedHelpTitle} hint={extendedHelpText} />
        }
        isRequired={isRequired}
      >
        <FileUpload
          allowEditingUploadedText
          isDragActive
          id={name}
          name={name}
          type="text"
          value={value}
          filename={filename}
          validated={(dirty || touched) && error ? 'error' : 'default'}
          onFileInputChange={this.handleFileChange}
          onDataChange={this.handleFileContentChange}
          onTextChange={this.handleFileContentChange}
          onClearClick={this.handleClear}
          dropzoneProps={{
            ...dropzoneProps,
            onDropRejected: this.handleFileRejected,
          }}
        />

        <FormGroupHelperText touched={dirty || touched} error={error}>
          {helpText}
        </FormGroupHelperText>
      </FormGroup>
    );
  }
}

ReduxFileUpload.defaultProps = {
  helpText: '',
  isRequired: false,
};

ReduxFileUpload.propTypes = {
  helpText: PropTypes.string,
  extendedHelpTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  extendedHelpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  dropzoneProps: PropTypes.object,
};

export default ReduxFileUpload;
