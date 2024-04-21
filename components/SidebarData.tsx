import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';

export const SidebarData = [
    {
        title: "ホーム",
        icon: <HomeIcon />,
        link: "/",
    },
    {
        title: "病院検索",
        icon: <PlaceIcon />,
        link: "/search",
    },
    {
        title: "カレンダー",
        icon: <EditCalendarIcon />,
        link: "/calendar",
    },
    {
        title: "服薬",
        icon: <MedicationLiquidIcon />,
        link: "/medicine",
    }
]