import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';

import Image from "next/image";
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

export const TutorialData = [
    {
        description: "GoogleMapのAPIを用いた病院検索",
        img: "/Image/googlemapIcon.png",
    },
    {
        description: "診察のスケジュールチェック",
        img: "/Image/calendarIcon.png",
    },
    {
        description: "服薬のお知らせ",
        img: "/Image/medicineIcon.png",
    }
]