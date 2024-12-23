/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { TextField } from '@mui/material';
import { ChangeEventHandler, useRef } from 'react';

export const FileInput = (props: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const onTextFieldClick = () => {
    inputRef.current?.click();
  };

  return (
    <div css={css({ width: '100%' })}>
      <input
        type="file"
        onChange={props.onChange}
        ref={inputRef}
        css={css({ display: 'none' })}
      />
      <TextField
        type="text"
        label="Select a file"
        value={props.value || ''}
        onClick={onTextFieldClick}
        slotProps={{
          input: {
            readOnly: true,
          },
          inputLabel: { shrink: !!props.value },
        }}
        css={css({ width: '100%' })}
      />
    </div>
  );
};
