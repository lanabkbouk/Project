import GuestNavbar from './GuestNavbar'
import VolunteerNavbar from './VolunteerNavbar'
import OrgNavbar from './OrgNavbar'

export default function MainNavbar({ variant = 'guest' }) {
  switch (variant) {
    case 'volunteer':
      return <VolunteerNavbar />
    case 'org':
      return <OrgNavbar />
    default:
      return <GuestNavbar />
  }
}

