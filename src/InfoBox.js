import { Card, CardContent, Typography } from '@mui/material'
import "./InfoBox.css"

const InfoBox = ({title, cases, isRed, active, total, ...props}) => {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}>
            <CardContent className='infoBox__content'>
                <Typography className='infoBox__title' color='textSecondary' gutterBottom>{title}</Typography>
                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>{cases}</h2>
                <Typography className='infoBox__total' color='textSecondary'>{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
