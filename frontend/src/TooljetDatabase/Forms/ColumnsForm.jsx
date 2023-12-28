import React, { useState } from 'react';
import cx from 'classnames';
//import Select from '@/_ui/Select';
import Select, { components } from 'react-select';
import AddColumnIcon from '../Icons/AddColumnIcon.svg';
import DeleteIconNew from '../Icons/DeleteIconNew.svg';
import { dataTypes, primaryKeydataTypes, formatOptionLabel } from '../constants';
import Tick from '../Icons/Tick.svg';

const ColumnsForm = ({ columns, setColumns }) => {
  const [columnIndex, setColumnIndex] = useState({ index: 0, value: '' });

  const handleDelete = (index) => {
    const newColumns = { ...columns };
    delete newColumns[index];
    setColumns(newColumns);
  };

  const darkMode = localStorage.getItem('darkMode') === 'true';
  const { Option } = components;

  const CustomSelectOption = (props) => (
    <Option {...props}>
      <div className="selected-dropdownStyle d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center justify-content-start">
          <div>{props.data.icon}</div>
          <span className="dataType-dropdown-label">{props.data.label}</span>
          <span className="dataType-dropdown-value">{props.data.name}</span>
        </div>
        <div>
          {columns[columnIndex.index].data_type === props.data.label ? (
            <div>
              <Tick width="16" height="16" />
            </div>
          ) : null}
        </div>
      </div>
    </Option>
  );

  const CustomStyle = {
    option: (base, state) => ({
      ...base,
      backgroundColor:
        state.isSelected && !darkMode ? '#F0F4FF' : state.isSelected && darkMode ? '#323C4B' : 'transparent',
      ':hover': {
        backgroundColor: state.isFocused && !darkMode ? '#F0F4FF' : '#323C4B',
      },
      color: darkMode ? '#fff' : '#232e3c',
      cursor: 'pointer',
    }),
    control: (provided, state) => ({
      ...provided,
      background:
        state.isDisabled && darkMode
          ? '#1f2936'
          : state.isDisabled && !darkMode
          ? '#f4f6fa'
          : state.isFocused && !darkMode
          ? '#fff'
          : state.isFocused && darkMode
          ? 'transparent'
          : !darkMode
          ? '#fff'
          : 'transparent',
      borderColor:
        state.isFocused && !darkMode
          ? '#90B5E2 !important'
          : state.isFocused && darkMode
          ? '#90b5e2 !important'
          : darkMode && state.isDisabled
          ? '#3a3f42'
          : '#dadcde',
      '&:hover': {
        borderColor: darkMode ? '#dadcde' : '#dadcde',
      },
      boxShadow: state.isFocused ? 'none' : 'none',
      height: '36px !important',
      minHeight: '36px',
    }),
    menuList: (provided, _state) => ({
      ...provided,
      padding: '8px',
      color: darkMode ? '#fff' : '#232e3c',
    }),
    menu: (base, state) => ({
      ...base,
      width: '360px',
      background: darkMode ? 'rgb(31,40,55)' : 'white',
      //borderColor: darkMode ? '#4c5155 !important' : '#c1c8cd !important',
    }),
  };

  return (
    <div className="">
      <div className="card-header">
        <h3 className="card-title" data-cy="add-columns-header">
          Add columns
        </h3>
      </div>
      <div className="card-body">
        <div
          className={cx('list-group-item', {
            'text-white': darkMode,
          })}
        >
          <div className="row align-items-center">
            <div className="col-3 m-0 pe-0">
              <span data-cy="name-input-field-label">Name</span>
            </div>
            <div className="col-3 m-0 pe-0">
              <span data-cy="type-input-field-label">Type</span>
            </div>
            <div className="col-3 m-0 pe-0">
              <span data-cy="default-input-field-label">Default</span>
            </div>
          </div>
        </div>
        {Object.keys(columns).map((index) => (
          <div
            key={index}
            className={cx('list-group-item mb-1', {
              'bg-gray': !darkMode,
            })}
          >
            <div className="row align-items-center">
              {/* <div className="col-1">
                  <DragIcon />
                </div> */}
              <div className="col-3 m-0 pe-0 ps-1" data-cy="column-name-input-field">
                <input
                  onChange={(e) => {
                    e.persist();
                    const prevColumns = { ...columns };
                    prevColumns[index].column_name = e.target.value;
                    setColumns(prevColumns);
                  }}
                  value={columns[index].column_name}
                  type="text"
                  className="form-control"
                  placeholder="Enter name"
                  data-cy={`name-input-field-${columns[index].column_name}`}
                  disabled={columns[index]?.constraints_type?.is_primary_key === true}
                />
              </div>
              <div className="col-3 pe-0 ps-1" data-cy="type-dropdown-field">
                <Select
                  width="120px"
                  height="36px"
                  isDisabled={columns[index]?.constraints_type?.is_primary_key === true}
                  //useMenuPortal={false}
                  options={columns[index]?.constraints_type?.is_primary_key === true ? primaryKeydataTypes : dataTypes}
                  onChange={(value) => {
                    setColumnIndex((prevState) => ({
                      ...prevState,
                      index: index,
                      value: value.value,
                    }));
                    const prevColumns = { ...columns };
                    prevColumns[index].data_type = value ? value.value : null;
                    setColumns(prevColumns);
                  }}
                  components={{ Option: CustomSelectOption, IndicatorSeparator: () => null }}
                  styles={CustomStyle}
                  formatOptionLabel={formatOptionLabel}
                  placeholder={
                    columns[index]?.constraints_type?.is_primary_key === true ? columns[0].data_type : 'Select...'
                  }
                />
              </div>
              <div className="col-2 m-0 pe-0 ps-1" data-cy="column-default-input-field">
                <input
                  onChange={(e) => {
                    e.persist();
                    const prevColumns = { ...columns };
                    prevColumns[index].column_default = e.target.value;
                    setColumns(prevColumns);
                  }}
                  value={columns[index].column_default}
                  type="text"
                  className="form-control"
                  data-cy="default-input-field"
                  placeholder="NULL"
                  disabled={
                    columns[index]?.constraints_type?.is_primary_key === true || columns[index].data_type === 'serial'
                  }
                />
              </div>
              {columns[index]?.constraints_type?.is_primary_key === true && (
                <div className="col-3">
                  <div
                    className={`badge badge-outline ${darkMode ? 'text-white' : 'text-indigo'}`}
                    data-cy="primary-key-text"
                  >
                    Primary Key
                  </div>
                </div>
              )}
              {columns[index]?.constraints_type?.is_primary_key !== true && (
                <div className="col-3 d-flex">
                  <label className={`form-switch`}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={columns[index]?.constraints_type?.is_not_null ?? false}
                      onChange={(e) => {
                        const prevColumns = { ...columns };
                        const columnConstraints = prevColumns[index]?.constraints_type ?? {};
                        columnConstraints.is_not_null = e.target.checked;
                        prevColumns[index].constraints_type = { ...columnConstraints };
                        setColumns(prevColumns);
                      }}
                    />
                  </label>
                  <span>{columns[index]?.constraints_type?.is_not_null ?? false ? 'NOT NULL' : 'NULL'}</span>
                </div>
              )}
              <div
                className="col-1 cursor-pointer d-flex"
                data-cy="column-delete-icon"
                onClick={() => handleDelete(index)}
              >
                {columns[index]?.constraints_type?.is_primary_key !== true && <DeleteIconNew width="16" height="16" />}
              </div>
            </div>
          </div>
        ))}
        <div
          onClick={() => {
            setColumns((prevColumns) => ({ ...prevColumns, [+Object.keys(prevColumns).pop() + 1 || 0]: {} })),
              setColumnIndex({ index: 0, value: '' });
          }}
          className="mt-2 btn border-0 card-footer add-more-columns-btn"
          data-cy="add-more-columns-button"
        >
          <AddColumnIcon />
          &nbsp;&nbsp; Add more columns
        </div>
      </div>
    </div>
  );
};

export default ColumnsForm;
