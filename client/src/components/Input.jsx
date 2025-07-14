const Input = ({
  label,
  type = "text",
  id,
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-600">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full mt-2 px-4 py-2 border rounded-md shadow-sm outline-none "
    />
  </div>
);

export default Input;
