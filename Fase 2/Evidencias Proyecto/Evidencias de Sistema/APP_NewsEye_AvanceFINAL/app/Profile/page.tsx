import React from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import '@/app/globals.css';

const ProfilePage = () => {
    return (
        <div className="profile-page">
            <div className="left-column">
                <ProfileHeader />
            </div>
        </div>
    );
};

export default ProfilePage;
