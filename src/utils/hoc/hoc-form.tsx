import React, { Component, ComponentClass, createContext, FormEvent, FormEventHandler } from 'react'


interface ContextData { 
    model: {[name: string]: unknown}; 
    changeModel(name: string, value: unknown): void; 
}

const FormContext = createContext<ContextData>({ model: {}, changeModel: () => {} });

export function form (WrappedComponent: ComponentClass) {
    return class extends Component {

        state = { model: {} };

        changeModel = (name: string, value: unknown) => {
            this.setState({ [name]: value });
        }

        render () {
            return <FormContext.Provider value={{ model: this.state.model, changeModel: this.changeModel }}>
                <WrappedComponent>
                    {this.props.children}
                </WrappedComponent>
            </FormContext.Provider>
        }
    }
}

export function formBind (WrappedComponent: ComponentClass<{ value: any; name: any; onChange: FormEventHandler }>) {

    return class extends Component<{name: string; onChange: any; validator: { msg: string; func(value: any): boolean | string }}> {

        state = { error: '' };

        static contextType = FormContext;

        change = (e: FormEvent) => {
            const { changeModel } = this.context;
            const { onChange } = this.props;

            const target = e.target as (typeof e.target & { value: any });
            changeModel(this.props.name, target.value);
            if (typeof onChange === 'function') onChange(target.value, this.props.name); 
        }

        validate (value: any) {
            const { validator: { msg, func } } = this.props;
            if (typeof func !== 'function') return;
            const rs = func(value);
            if (typeof rs === 'string') {
                return this.setState({ error: rs });
            }
            this.setState({ error: rs ? '' : msg });
        }

        render () {
            const { model } = this.context;
            const value = model[this.props.name];

            return <div>
                <WrappedComponent {...this.props} value={value} onChange={this.change}/>
                <span className="error">{this.state.error}</span>
            </div> 
        }

    }
}
