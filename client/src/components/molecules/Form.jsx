import React, { useEffect, useState } from 'react';

//Importacion de Componentes atoms
import Select from '../atoms/Select';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const Form = ({ fields, initialData = {}, onSubmit, onCancel }) => {
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

    // Definicion de estilo base
    const baseStyles = 'w-full flex flex-col gap-4 py-2';
    // Definicion de estilo acciones
    const styleActions =
        'flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border-primary';

    return (
        <form className={baseStyles} onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
                {fields.map((field) => {
                    const value = formData[field.name] || '';

                    if (field.type === 'select') {
                        return (
                            <Select
                                options={field.options}
                                label={field.label}
                                name={field.name}
                                value={value}
                                onChange={(value) =>
                                    handleChange(field.name, value)
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
            </div>
            <div className={styleActions}>
                <>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                        Guardar Cambios
                    </Button>
                </>
            </div>
        </form>
    );
};

export default Form;
