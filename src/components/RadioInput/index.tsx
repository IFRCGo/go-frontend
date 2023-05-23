import React from 'react';
import { DeleteBinFillIcon } from '@ifrc-go/icons';

import { _cs, isDefined } from '@togglecorp/fujs';
import List from '#components/List';
import InputLabel from '#components/InputLabel';
import InputError from '#components/InputError';
import Button from '#components/Button';
import Radio, { Props as RadioProps } from './Radio';

import styles from './styles.module.css';

export interface BaseProps<N, O, V, RRP extends RadioProps<V, N>> {
    className?: string;
    options: O[];
    name: N;
    value: V | undefined | null;
    keySelector: (option: O) => V;
    labelSelector: (option: O) => React.ReactNode;
    descriptionSelector?: (option: O) => React.ReactNode;
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    labelContainerClassName?: string;
    hintContainerClassName?: string;
    errorContainerClassName?: string;
    listContainerClassName?: string;
    disabled?: boolean;
    readOnly?: boolean;
    renderer?: (p: RRP) => React.ReactElement;
    rendererParams?: (o: O) => Omit<RRP, 'inputName' | 'label' | 'name' | 'onClick' | 'value'>;
    clearable?: boolean;
}

type NonClearableProps<V, N> = {
    clearable?: false;
    onChange: (value: V, name: N) => void;
}

type ClearableProps<V, N> = {
    clearable: true;
    onChange: (value: V | undefined, name: N) => void;
}

type Props<N, O, V, RRP extends RadioProps<V, N>> = BaseProps<N, O, V, RRP> & (
    ClearableProps<V, N> | NonClearableProps<V, N>
)

function isClearable<N, O, V, RRP extends RadioProps<V, N>>(props: Props<N, O, V, RRP>): props is (BaseProps<N, O, V, RRP> & ClearableProps<V, N>) {
    return !!props.clearable;
}

function RadioInput<
    N,
    O extends object,
    V extends string | number | boolean,
    RRP extends RadioProps<V, N>,
>(props: Props<N, O, V, RRP>) {
    const isClearableOptions = isClearable(props);

    const {
        className,
        name,
        options,
        value,
        keySelector,
        labelSelector,
        descriptionSelector,
        label,
        labelContainerClassName,
        listContainerClassName,
        error,
        errorContainerClassName,
        renderer = Radio,
        rendererParams: radioRendererParamsFromProps,
        disabled,
        readOnly,
        onChange,
    } = props;

    const handleRadioClick = React.useCallback((radioKey: V | undefined) => {
        if (readOnly) {
            return;
        }

        if (isClearableOptions) {
            props.onChange(radioKey, name);
        }

        if (!isClearableOptions && isDefined(radioKey)) {
            onChange(radioKey, name);
        }
    }, [readOnly, props.onChange, name, props.clearable]);

    const rendererParams: (
        k: V,
        i: O,
    ) => RRP = React.useCallback((key: V, item: O) => {
        const radioProps: Pick<RRP, 'inputName' | 'label' | 'name' | 'onClick' | 'value' | 'disabled' | 'readOnly' | 'description'> = {
            inputName: name,
            label: labelSelector(item),
            description: descriptionSelector ? descriptionSelector(item) : undefined,
            name: key,
            onClick: handleRadioClick,
            value: key === value,
            disabled,
            readOnly,
        };

        const combinedProps = {
            ...(radioRendererParamsFromProps ? radioRendererParamsFromProps(item) : undefined),
            ...radioProps,
        } as RRP;

        return combinedProps;
    }, [
        name,
        labelSelector,
        value,
        handleRadioClick,
        radioRendererParamsFromProps,
        disabled,
        readOnly,
        descriptionSelector,
    ]);

    return (
        <div
            className={_cs(
                styles.radioInput,
                disabled && styles.disabled,
                className,
            )}
        >
            {props.clearable && (
                <Button
                    name={undefined}
                    className={styles.clearButton}
                    onClick={handleRadioClick}
                >
                    <DeleteBinFillIcon />
                </Button>
            )}
            <InputLabel
                className={labelContainerClassName}
                disabled={disabled}
            >
                {label}
            </InputLabel>
            <div className={_cs(styles.radioListContainer, listContainerClassName)}>
                <List<O, RadioProps<V, N> & RRP, V, any, any>
                    data={options}
                    rendererParams={rendererParams}
                    renderer={renderer}
                    keySelector={keySelector}
                />
            </div>
            <InputError className={errorContainerClassName}>
                {error}
            </InputError>
        </div>
    );
}

export default RadioInput;
