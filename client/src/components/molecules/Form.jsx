import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

//Importacion de Componentes atoms
import Select from '../atoms/Select';
import Input from '../atoms/Input';

/**
 * @description Componente Formulario
 * @param {Object} props - Props del componente
 * @param {Array}  props.fields - Campos del formulario
 * @param {Array} props.initialData - Datos iniciales del formulario
 * @param {function} props.onSubmit - Funcion al enviar el formulario
 * @param {function} props.onCancel - Funcion al cancelar el formulario
 * @param {React.ReactNode} props.children - Elementos hijos personalziados
 * @returns {JSX.Element} Componente Formulario
 */

const Form = ({ fields, initialData = {}, onSubmit, onCancel, children }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // TODO Definicion de estilo base
    const baseStyles = '';
    // TODO Definicion de estilo acciones
    const styleActions = '';

    return (
        <form className={baseStyles} onSubmit={handleSubmit}>
            {fields.map((field) => {
                const value = formData[field.name] || '';

                if (field.type === 'select') {
                    return (
                        <Select
                            options={field.options}
                            label={field.label}
                            name={field.name}
                            value={value}
                            onChange={(e) =>
                                handleChange(field.name, e.target.value)
                            }
                            placeholder={field.placeholder}
                        ></Select>
                    );
                }

                return (
                    <Input
                        type={field.type}
                        name={field.name}
                        label={field.label}
                        value={value}
                        onChange={(e) =>
                            handleChange(field.name, e.target.value)
                        }
                        placeholder={field.placeholder}
                        {...field}
                    ></Input>
                );
            })}
            <div className={styleActions}>
                {children ? (
                    children
                ) : (
                    <>
                        <Button type="submit" variant="primary">
                            Guardar
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>
                    </>
                )}
            </div>
        </form>
    );
};

//Definicion de props del componente
Form.propTypes = {
    fields: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    children: PropTypes.node,
};

export default Form;
