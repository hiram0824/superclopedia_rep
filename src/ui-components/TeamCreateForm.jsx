/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Team } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function TeamCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    leader: "",
    headquarters: "",
    members: "",
    info: "",
    image: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [leader, setLeader] = React.useState(initialValues.leader);
  const [headquarters, setHeadquarters] = React.useState(
    initialValues.headquarters
  );
  const [members, setMembers] = React.useState(initialValues.members);
  const [info, setInfo] = React.useState(initialValues.info);
  const [image, setImage] = React.useState(initialValues.image);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setLeader(initialValues.leader);
    setHeadquarters(initialValues.headquarters);
    setMembers(initialValues.members);
    setInfo(initialValues.info);
    setImage(initialValues.image);
    setErrors({});
  };
  const validations = {
    name: [{ type: "Required" }],
    leader: [],
    headquarters: [],
    members: [],
    info: [],
    image: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name,
          leader,
          headquarters,
          members,
          info,
          image,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(new Team(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "TeamCreateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              leader,
              headquarters,
              members,
              info,
              image,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Leader"
        isRequired={false}
        isReadOnly={false}
        value={leader}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              leader: value,
              headquarters,
              members,
              info,
              image,
            };
            const result = onChange(modelFields);
            value = result?.leader ?? value;
          }
          if (errors.leader?.hasError) {
            runValidationTasks("leader", value);
          }
          setLeader(value);
        }}
        onBlur={() => runValidationTasks("leader", leader)}
        errorMessage={errors.leader?.errorMessage}
        hasError={errors.leader?.hasError}
        {...getOverrideProps(overrides, "leader")}
      ></TextField>
      <TextField
        label="Headquarters"
        isRequired={false}
        isReadOnly={false}
        value={headquarters}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              leader,
              headquarters: value,
              members,
              info,
              image,
            };
            const result = onChange(modelFields);
            value = result?.headquarters ?? value;
          }
          if (errors.headquarters?.hasError) {
            runValidationTasks("headquarters", value);
          }
          setHeadquarters(value);
        }}
        onBlur={() => runValidationTasks("headquarters", headquarters)}
        errorMessage={errors.headquarters?.errorMessage}
        hasError={errors.headquarters?.hasError}
        {...getOverrideProps(overrides, "headquarters")}
      ></TextField>
      <TextField
        label="Members"
        isRequired={false}
        isReadOnly={false}
        value={members}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              leader,
              headquarters,
              members: value,
              info,
              image,
            };
            const result = onChange(modelFields);
            value = result?.members ?? value;
          }
          if (errors.members?.hasError) {
            runValidationTasks("members", value);
          }
          setMembers(value);
        }}
        onBlur={() => runValidationTasks("members", members)}
        errorMessage={errors.members?.errorMessage}
        hasError={errors.members?.hasError}
        {...getOverrideProps(overrides, "members")}
      ></TextField>
      <TextField
        label="Info"
        isRequired={false}
        isReadOnly={false}
        value={info}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              leader,
              headquarters,
              members,
              info: value,
              image,
            };
            const result = onChange(modelFields);
            value = result?.info ?? value;
          }
          if (errors.info?.hasError) {
            runValidationTasks("info", value);
          }
          setInfo(value);
        }}
        onBlur={() => runValidationTasks("info", info)}
        errorMessage={errors.info?.errorMessage}
        hasError={errors.info?.hasError}
        {...getOverrideProps(overrides, "info")}
      ></TextField>
      <TextField
        label="Image"
        isRequired={false}
        isReadOnly={false}
        value={image}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              leader,
              headquarters,
              members,
              info,
              image: value,
            };
            const result = onChange(modelFields);
            value = result?.image ?? value;
          }
          if (errors.image?.hasError) {
            runValidationTasks("image", value);
          }
          setImage(value);
        }}
        onBlur={() => runValidationTasks("image", image)}
        errorMessage={errors.image?.errorMessage}
        hasError={errors.image?.hasError}
        {...getOverrideProps(overrides, "image")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
