import React from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import UserPosts from '@/components/profile/Posts';
import '@/app/globals.css';

const ProfilePage = () => {
    return (
        <div className="profile-page">
            <div className="left-column">
                <ProfileHeader />
            </div>
            <div className="right-column">
                <UserPosts />
            </div>
        </div>
    );
};

export default ProfilePage;
