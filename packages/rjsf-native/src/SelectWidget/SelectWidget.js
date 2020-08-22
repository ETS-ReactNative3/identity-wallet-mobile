import React from "react";

// import MenuItem from "@material-ui/core/MenuItem";
// import TextField from "@material-ui/core/TextField";

import {
  Grid,
  Col,
  Row,
  Explanatory,
  SelectBox
} from '@selfkey/mobile-ui';


import { WidgetProps } from "@selfkey/rjsf-core";
import { utils } from "@selfkey/rjsf-core";
import { getMessage } from "../TextWidget";

const { asNumber, guessType } = utils;

const nums = new Set(["number", "integer"]);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema: any, value: any) => {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema;
  if (value === "") {
    return undefined;
  } else if (type === "array" && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }
  
  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every((x: any) => guessType(x) === "number")) {
      return asNumber(value);
    } else if (schema.enum.every((x: any) => guessType(x) === "boolean")) {
      return value === "true";
    }
  }
  
  return value;
};

const SelectWidget = (props: WidgetProps) => {
  const {
    schema,
    id,
    options,
    label,
    required,
    disabled,
    readonly,
    value,
    multiple,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    rawErrors = [],
  } = props;
  const { enumOptions, enumDisabled } = options;
  const emptyValue = multiple ? [] : "";  
  const _onChange = (value) => onChange(processValue(schema, value));

  return (
    <SelectBox
      label={label || schema.title}
      onValueChange={_onChange}
      selectedValue={value}
      required={required}
      disabled={disabled || readonly}
      placeholder="Select"
      error={rawErrors.length > 0}
      errorMessage={getMessage(props)}
      items={enumOptions}
    />
    // <TextField
    // id={id}
    // label={label || schema.title}
    // name={name}
    // select
    // value={typeof value === "undefined" ? emptyValue : value}
    // required={required}
    // disabled={disabled || readonly}
    // autoFocus={autofocus}
    // error={rawErrors.length > 0}
    // onChange={_onChange}
    //   onBlur={_onBlur}
    //   onFocus={_onFocus}
    //   InputLabelProps={{
    //     shrink: true,
    //   }}
    //   SelectProps={{
    //     multiple: typeof multiple === "undefined" ? false : multiple,
    //   }}>
    //   {(enumOptions ).map(({ value, label }: any, i: number) => {
    //     const disabled: any =
    //       enumDisabled && (enumDisabled ).indexOf(value) != -1;
    //     return (
    //       <MenuItem key={i} value={value} disabled={disabled}>
    //         {label}
    //       </MenuItem>
    //     );
    //   })}
    // </TextField>
  );
};

export default SelectWidget;
