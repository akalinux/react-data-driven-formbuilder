import React, { Component, PropTypes } from 'react';
import { ChtFormElements } from './chtr-form-elements.js';
import { cloneObject, mergeObjects, objectsDiffer, cloneProps  } from 'react-chtr-object-methods';


class ChtrFormRaidioSet extends React.Component {
    
    static buildData (props) {
        let input;
        if(props.hasOwnProperty('input')) {
          input=props.input;  
        } else {
            input=ChtrFormRaidioSet.defaultProps.input;
        }
        
        if(input==null) {
            input=ChtrFormRaidioSet.defaultProps.input;
        }
        
        return input;
    }
    constructor( props ) {
        super( props );
        this.state = cloneProps( props );
        this.handleChange = this.handleChange.bind( this );
        this.handleSubmitCheck=this.handleSubmitCheck.bind(this);
    }

    handleSubmitCheck() {
        this.handleValidate();
    }

    matchOptions( input ) {
        for (let id in this.state.data) {
            if ( input == this.state.data[id].value ) {
                return true;
            }
        }
        return false;
    }

    handleValidate() {

        const target = cloneObject( this.state );
        if ( this.state.required && !this.matchOptions( this.state.input ) ) {
            target['classNameRadioButtonCell'] = this.state.classNameRadioButtonCellFailed
            this.props.onValidate( this.state.dataPath, this.state.displayPath, target, false );
        } else {
            target['classNameRadioButtonCell'] = this.state.classNameRadioButtonCellDefault;
            this.props.onValidate( this.state.dataPath, this.state.displayPath, target, true );
        }
    }

    handleChange( e ) {

        this.state.input = e.target.value;
        this.props.onChange( this.state.dataPath, this.state.displayPath, this.state );
    }

    componentWillUnmount() {
        this.props.root.deleteSubmitCheck( this.state.dataPath );
    }

    componentDidMount() {
        this.props.root.registerSubmitCheck( this.state.dataPath, this.handleSubmitCheck );
    }

    componentWillReceiveProps( newProps ) {
        this.props.root.deleteSubmitCheck( this.state.dataPath );
        this.setState( cloneProps( newProps ) );
        this.props.root.registerSubmitCheck( newProps.dataPath, this.handleSubmitCheck );
    }


    renderFields() {
        let id = this.state.offset;
        const instance = this;
        return this.state.data.map( function( field ) {

            ++id;
            const keyPath=instance.state.displayPath.slice(0);
            keyPath.push('textRadio',id);
            const key = instance.props.root.genKey(keyPath);
            return (
                <div key={key} className={instance.state.classNameRaidoRow}>
                    <div className={instance.state.classNameRadioCellIndent}>{field.label}</div>
                    <div className={instance.state.classNameRadioButtonCell}>
                    <input
                        checked={instance.state.input === field.value}
                        value={field.value}
                        className={instance.state.classNameInputRaidio}
                        type="radio"
                        onChange={instance.handleChange}
                        disabled={instance.state.disabled}
                    />
                    </div>
                </div>
            );
        } )
    }

    render() {
        return (
            < div className={this.state.className} >
                {this.statelabel != "" ? <div className={this.state.classNameRadioHeader} >{this.state.label}</div> : ""}
                <div className={this.state.classNameRaidioRowContainer}>{this.renderFields()}</div>
            </div>
        );
    }
}

const css={
        classNameInputRaidio: "ChtrFormDefaultsInputRaidio",
        classNameRadioCellIndent: "chtr-form-radio-indent",
        classNameRadioHeader: "ChtrFormRadioHeader",
        classNameRaidoRow: "chtr-form-raidio-row",
        classNameRaidioRowContainer: "chtr-form-raidio-row-container",
        classNameRadioButtonCell: 'chtr-form-radio-button-cell',
        classNameRadioButtonCellDefault: 'chtr-form-radio-button-cell',
        classNameRadioButtonCellFailed: 'chtr-form-radio-button-cell-failed',
};

ChtrFormRaidioSet.defaultProps = {
    handleUpdate: function( state ) { },
    input: "",
    data: [],
    offset: 0,
    label: "",
    disabled: false
};
ChtFormElements['radio'] = ChtrFormRaidioSet;
Object.assign(ChtrFormRaidioSet.defaultProps,css);





