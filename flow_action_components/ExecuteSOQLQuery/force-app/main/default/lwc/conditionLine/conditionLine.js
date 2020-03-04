import {LightningElement, api} from 'lwc';

export default class ConditionLine extends LightningElement {
    @api allOperations;
    @api allFields;
    @api fieldName;
    _fieldType;
    @api operation;
    @api value;
    @api lineId;
    @api index;
    @api fieldTypeSettings;
    @api preventErrors;

    @api get fieldType() {
        return this._fieldType;
    }

    set fieldType(value) {
        this._fieldType = value;
    }

    get inputType() {
        if (this._fieldType && this.fieldTypeSettings[this._fieldType]) {
            return this.fieldTypeSettings[this._fieldType].inputType;
        }
    }

    get availableOperations() {
        if (this.allOperations) {
            return this.allOperations.filter(curOperation => {
                if (this._fieldType) {
                    return curOperation.types.includes(this._fieldType);
                } else {
                    return false;
                }

            });
        }

    }

    get conditionIndex() {
        return this.index + 1;
    }

    get isDisabled() {
        return !this.fieldName;
    }

    get valueVariant() {
        return (this._fieldType === 'Date' || this._fieldType === 'DateTime') ? 'label-hidden' : 'label-stacked';
    }

    handleConditionChanged(event) {
        let inputName = event.target.name;
        this[inputName] = (this._fieldType === 'Boolean' && inputName === 'value') ? event.target.checked : event.target.value;
        this.dispatchConditionChangedEvent();
    }

    handleFieldChanged(event) {
        this.fieldName = event.detail.newValue;
        if (event.detail.displayType) {
            this._fieldType = event.detail.displayType;
        }
        this.dispatchConditionChangedEvent();
    }

    handleConditionRemove(event) {
        const filterChangedEvent = new CustomEvent('conditionremoved', {
            detail: {
                id: this.lineId
            }
        });
        this.dispatchEvent(filterChangedEvent);
    }

    get fieldNameClass() {
        if (!this.fieldName && !this.preventErrors) {
            return 'slds-has-error';
        }
    }

    get valueClass() {
        let resultClass = '';
        if (this._fieldType === 'Date' || this._fieldType === 'DateTime') {
            resultClass += 'slds-p-top--large '
        }
        if (this._fieldType && !this.value) {
            resultClass += 'slds-has-error ';
        }
        return resultClass;
    }

    dispatchConditionChangedEvent() {
        const filterChangedEvent = new CustomEvent('conditionchanged', {
            detail: {
                fieldName: this.fieldName,
                dataType: this._fieldType,
                operation: this.operation,
                value: this.value,
                id: this.lineId
            }
        });
        this.dispatchEvent(filterChangedEvent);
    }
}