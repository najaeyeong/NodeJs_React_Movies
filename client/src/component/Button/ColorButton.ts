import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Button, { ButtonProps } from '@mui/material/Button';

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
  }));

  export default ColorButton