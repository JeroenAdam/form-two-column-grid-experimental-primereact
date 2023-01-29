import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { CountryService } from './CountryService';
import { AutoComplete } from "primereact/autocomplete";

function FinalForm() {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const [countryValue, setCountryValue] = useState(null);
    const [selectedCountryValue, setSelectedCountryValue] = useState(null);
    const [selectedCityValue, setSelectedCityValue] = useState(null);
    const [selectedAutoValueCity, setSelectedAutoValueCity] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [data1, setData1] = useState([]); 

    useEffect(() => {
        const countryService = new CountryService();
        countryService.getCountries().then((data) => setCountryValue(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const restypes = [ "ARTICLES", "DOCUMENTS", "PRESENTATION", "IMAGES", "URLS", "ANNOUNCEMENTS", "OTHER" ];

    const ageranges = [ "AGE_ALL", "AGE_04_06", "AGE_07_09", "AGE_10_12", "AGE_13_15", "AGE_16_18" ];
    
    const validate = (data) => {
        let errors = {};

        if (!data.name) {
            errors.name = 'Title is required.';
        }

        if (!data.subject) {
            errors.subject = 'Subject is required.';
        }        

        if (!data.restype) {
            errors.restype = 'Resource Type is required.';
        }

        if (!data.accept) {
            errors.accept = 'You need to agree to the terms and conditions.';
        }

        return errors;
    };

    const onSubmit = (data, form) => {
        setFormData(data);
        setShowMessage(true);
        form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="text-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false) } /></div>;

    const searchCountry = (event) => {
        setTimeout(() => {
          if (!event.query.trim().length) {
            setAutoFilteredValue([...countryValue]);
          } else {
            setAutoFilteredValue(
              countryValue.filter((country) => {
                console.log((country))
                return country.name
                  .toLowerCase()
                  .startsWith(event.query.toLowerCase());
              })
            );
          }
        }, 250);
      };
    
      const searchCity = (event) => {
        if (data1) {
          setSelectedAutoValueCity(
            data1.topics.filter((country) => {
              return country.label
                .toLowerCase()
                .startsWith(event.query.toLowerCase());
            })
          );
        } else {
          setSelectedAutoValueCity([]);
        }
      };
    
      const onCountryChange = (event) => {
        setData1(event);
        setSelectedCountryValue(event);
        setSelectedCityValue([]);
      };
    
    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <div className="text-900 font-bold text-xl mt-5">Saved successfully!</div>
                    <p className="line-height-3 my-4">
                        Your resource <b>{formData.name}</b> has been saved successfully. It'll be validated within 1 day by a moderator. You'll receive an email.
                    </p>
                    <p className="line-height-3 my-4">description:&nbsp;{formData.description}<br/>subject:&nbsp;{formData.subject}<br/>topic:&nbsp;{formData.topic}<br/>restype:&nbsp;{formData.restype}<br/>agerange:&nbsp;{formData.agerange}</p>
                </div>
            </Dialog>

            <div className="surface-card border-round shadow-2 p-4">
                <span className="text-900 text-2xl font-medium mb-4 block">Create a new resource</span>
                <Form onSubmit={onSubmit} initialValues={{ name: '', subject: 'dummy', description: '', topic: '', restype: '', agerange: 'AGE_ALL', accept: false }} validate={validate} render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <Field name="name" render={({ input, meta }) => (
                            <div className="mb-4">
                                <span className="p-float-label">
                                    <InputText id="name" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                    <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Title*</label>
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />
                        <Button label="subject" icon="pi pi-plus" className="p-button-sm p-button-outlined max-w-8rem"/>                   
                        <Field name="subject" render={({ input, meta }) => (
                            <div className="mb-4">
                                <span>
                                    <AutoComplete id="subject"  {...input} dropdown value={selectedCountryValue} field="subject" completeMethod={searchCountry} onChange={(e) => onCountryChange(e.value)}
                                    suggestions={autoFilteredValue} placeholder="Select Subject" scrollHeight="400px"/>
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />
                        <Field name="description" render={({ input, meta }) => (
                            <div className="mb-4">
                                <span className="p-float-label">
                                <InputTextarea id="description" {...input} field="name" className={classNames({ 'p-invalid': isFormFieldValid(meta) })} rows={5} cols={30} />
                                    <label htmlFor="description">Description</label>  
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />
                        <Button label="topic" icon="pi pi-plus" className="p-button-sm p-button-outlined max-w-8rem"/>                                           
                        <Field name="topic" render={({ input, meta }) => (
                            <div className="mb-4">
                                <span className="p-float-label">
                                    <AutoComplete id="topic"  {...input} value={selectedCityValue} field="label" placeholder="Select Topic" dropdown completeMethod={searchCity}
                                    suggestions={selectedAutoValueCity} onChange={(e) => setSelectedCityValue(e.value)} />
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />
                        <Field name="restype" render={({ input, meta }) => (
                            <div className="mb-4">
                                <span className="p-float-label">
                                    <Dropdown id="restype" {...input} options={restypes}
                                    placeholder="Select a Resource Type" scrollHeight="400px" className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />                    
                                    <label htmlFor="restype">Resource Type</label>
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />       
                        <Field name="agerange" render={({ input, meta }) => (
                            <div className="mb-4">
                                <span className="p-float-label">
                                    <Dropdown {...input} field="agerange" options={ageranges}
                                    placeholder="Select a Age Range" scrollHeight="400px" className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />                         
                                    <label htmlFor="agerange">Age range</label>
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />          
                        <Button label="skill" icon="pi pi-plus" className="p-button-sm p-button-outlined max-w-8rem"/>                                           
                        <Field name="topic" render={({ input, meta }) => (
                            <div className="mb-4">
                                <span className="p-float-label">
                                    <AutoComplete id="topic"  {...input} value={selectedCityValue} field="label" placeholder="Select Topic" dropdown completeMethod={searchCity}
                                    suggestions={selectedAutoValueCity} onChange={(e) => setSelectedCityValue(e.value)} />
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />                                                                             
                        <Field name="accept" type="checkbox" render={({ input, meta }) => (
                            <div className="mb-4 flex align-items-center">
                                <Checkbox inputId="accept" {...input} className={classNames('mr-3', { 'p-invalid': isFormFieldValid(meta) })} />
                                <label htmlFor="accept" className={classNames({ 'p-error': isFormFieldValid(meta) })}>I created this resource myself without using copyrighted materials&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            </div>
                        )} />
                        <Button type="submit" label="Submit" className="p-mt-2" />
                    </form>
                )} />
            </div>
        </div>
    );
}

export default FinalForm;