import React, { Component, PropTypes } from 'react';
import { ChtFormElements } from './chtr-form-elements.js';
import { cloneObject, mergeObjects, objectsDiffer, cloneProps  } from 'react-chtr-object-methods';

class ChtrFormSelectMulti extends React.Component {
    static buildData( props ) {
        if ( props.hasOwnProperty( 'input' ) && props.input != null && typeof ( props.input ) == 'object' && props.input.constructor == Array ) {
            return props.input.slice( 0 );
        } else {
            return [];
        }
    }
    constructor( props ) {
        super( props );
        this.state = cloneProps( props );
        // make sure we are handling an array!
        this.state.input = ChtrFormSelectMulti.buildData( props );

        this.handleChange = this.handleChange.bind( this );
        this.handleSubmitCheck = this.handleSubmitCheck.bind( this );
    }

    componentWillReceiveProps( newProps ) {
        this.props.root.deleteSubmitCheck( this.state.dataPath );
        const state = cloneProps( newProps );
        state.input = ChtrFormSelectMulti.buildData( newProps );
        this.setState( state );
        this.props.root.registerSubmitCheck( newProps.dataPath, this.handleSubmitCheck );
        this.renderOptions( newProps );
    }

    clearSelect() {
        const select = this.input;
        for ( let x = select.options.length; select.options.length > 0; --x ) {
            select.options.remove( x );
        }
    }

    componentWillUnmount() {
        this.clearSelect();
        this.input = undefined;
        this.props.root.deleteSubmitCheck( this.state.dataPath );
    }


    renderOptions( props ) {
        this.clearSelect();
        this.input.size = props.size;
        const map = {};
        for ( let x in props.input ) {
            map[props.input[x]] = true;
        }

        for ( let x in props.data ) {
            const opt = props.data[x];
            const option = new Option( opt.label, opt.value );
            option.classList.add( props.classNameSelectOption );
            option.selected = map.hasOwnProperty( opt.value );
            this.input.options.add( option );
        }
    }

    componentDidMount() {
        this.renderOptions( this.state );
        this.props.root.registerSubmitCheck( this.state.dataPath, this.handleSubmitCheck );
    }

    handleSubmitCheck() {
        this.handleValidate();
    }


    handleValidate() {

        const target = cloneObject( this.state );
        if ( this.state.required && this.state.input.length <= 0 ) {
            target['classNameSelectCell'] = this.state.classNameSelectCellError;
            target['classNameSelectOption'] = this.state.classNameSelectOptionError;

            this.props.onValidate( this.state.dataPath, this.state.displayPath, target, false );
        } else {
            target['classNameSelectCell'] = this.state.classNameSelectCellefault;
            target['classNameSelectOption'] = this.state.classNameSelectOptionDefault;
            this.props.onValidate( this.state.dataPath, this.state.displayPath, target, true );
        }
    }

    handleChange( e ) {
        const props = cloneObject( this.state );
        props.input = [];
        const state = props.input;
        const select = this.input;

        if ( select.selectedIndex > -1 ) {
            const options = select.options;
            for ( let id in options ) {
                const option=options[id];
                if(option!=null && option.selected) {
                    state.push(option.value);
                }
            }
        }


        this.props.onChange( this.state.dataPath, this.state.displayPath, props );
    }

    render() {
        const instance = this;
        return (
            < div className={this.props.classNameSelectRow} >
                {this.props.label != "" ? <div className={this.state.classNameSelectHeader} >{this.state.label}</div> : ""}
                <div className={this.state.classNameSelectCell}>
                    <select
                        multiple={true}
                        ref={( input ) => instance.input = input}
                        onChange={this.handleChange}
                        disabled={this.state.disabled}
                        className={this.state.classNameSelect}
                    />
                </div>
            </div >
        );
    }
}

const css = {
    classNameSelectRow: "ChtrFormSelectRow",
    classNameSelectHeader: "ChtrFormSelectHeader",
    classNameSelectCell: "chtr-form-select-cell",
    classNameSelectCellDefault: "chtr-form-select-cell",
    classNameSelectCellError: "chtr-form-select-cell-error",
    classNameSelect: "chtr-form-select-multi",
    classNameSelectOption: "chtr-form-select-option",
    classNameSelectOptionDefault: "chtr-form-select-option",
    classNameSelectOptionError: "chtr-form-select-option-error",
};

ChtrFormSelectMulti.defaultProps = {
    input: [],
    size: 5,
    data: [],
    label: "",
    disabled: false
};

Object.assign( ChtrFormSelectMulti.defaultProps, css );
ChtFormElements['multiselect'] = ChtrFormSelectMulti;

// End of the module
