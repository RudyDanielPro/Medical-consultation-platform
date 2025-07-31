import { useLocation } from 'react-router-dom';
import { Notification } from './Notification';

export function NotificationDoctor() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const doctorEmail = queryParams.get('email');

    return <Notification doctorEmail={doctorEmail} />;
}