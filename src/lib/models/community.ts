import { BasicResponse } from "../model.js";

export interface Community extends BasicResponse {
    currentUserInfo:     CurrentUserInfo;
    community:           CommunityClass;
    isCurrentUserJoined: boolean;
}

export interface CommunityClass {
    userAddedTopicList:                 UserAddedTopicList[];
    searchable:                         boolean;
    isStandaloneAppDeprecated:          boolean;
    influencerList:                     any[];
    agent:                              Agent;
    listedStatus:                       number;
    probationStatus:                    number;
    keywords:                           string;
    themePack:                          ThemePack;
    membersCount:                       number;
    primaryLanguage:                    string;
    communityHeat:                      number;
    mediaList:                          Array<Array<number | string>>;
    content:                            string;
    isStandaloneAppMonetizationEnabled: boolean;
    tagline:                            string;
    advancedSettings:                   AdvancedSettings;
    joinType:                           number;
    status:                             number;
    modifiedTime:                       Date;
    ndcId:                              number;
    activeInfo:                         ActiveInfo;
    link:                               string;
    communityHeadList:                  Agent[];
    configuration:                      Configuration;
    icon:                               string;
    updatedTime:                        Date;
    endpoint:                           string;
    name:                               string;
    extensions:                         CommunityExtensions;
    templateId:                         number;
    createdTime:                        Date;
    promotionalMediaList:               Array<Array<number | null | string>>;
}

export interface ActiveInfo {
}

export interface AdvancedSettings {
    defaultRankingTypeInLeaderboard: number;
    frontPageLayout:                 number;
    hasPendingReviewRequest:         boolean;
    welcomeMessageEnabled:           boolean;
    welcomeMessageText:              string;
    leaderboardStyle:                LeaderboardStyle;
    pollMinFullBarVoteCount:         number;
    catalogEnabled:                  boolean;
    facebookAppIdList:               null;
    newsfeedPages:                   NewsfeedPage[];
    rankingTable:                    RankingTable[];
    joinedBaselineCollectionIdList:  string[];
}

export interface LeaderboardStyle {
    leaderboard3: Leaderboard1;
    leaderboard2: Leaderboard1;
    leaderboard1: Leaderboard1;
    leaderboard5: Leaderboard1;
    leaderboard4: Leaderboard1;
}

export interface Leaderboard1 {
    backgroundMediaList: Array<Array<number | null | string>>;
}

export interface NewsfeedPage {
    status: number;
    type:   number;
}

export interface RankingTable {
    level:      number;
    reputation: number;
    id:         string;
    title:      string;
}

export interface Agent {
    status:                  number;
    isNicknameVerified:      boolean;
    uid:                     string;
    level:                   number;
    followingStatus:         number;
    accountMembershipStatus: number;
    isGlobal:                boolean;
    membershipStatus:        number;
    avatarFrameId?:          string;
    reputation:              number;
    role:                    number;
    ndcId:                   number;
    membersCount:            number;
    nickname:                string;
    icon:                    string;
}

export interface Configuration {
    appearance: Appearance;
    page:       Page;
    module:     Module;
    general:    General;
}

export interface Appearance {
    homePage:      HomePage;
    leftSidePanel: LeftSidePanel;
}

export interface HomePage {
    navigation: NavigationElement[];
}

export interface NavigationElement {
    id:           string;
    isStartPage?: boolean;
}

export interface LeftSidePanel {
    style:      LeftSidePanelStyle;
    navigation: LeftSidePanelNavigation;
}

export interface LeftSidePanelNavigation {
    level1: Level[];
    level2: Level[];
}

export interface Level {
    id: string;
}

export interface LeftSidePanelStyle {
    iconColor: string;
}

export interface General {
    onlyAllowOfficialTag:           boolean;
    videoUploadPolicy:              number;
    hasPendingReviewRequest:        boolean;
    accountMembershipEnabled:       boolean;
    disableLiveLayerVisible:        boolean;
    welcomeMessage:                 WelcomeMessage;
    disableLiveLayerActive:         boolean;
    invitePermission:               number;
    facebookAppIdList:              null;
    disableLocation:                boolean;
    joinTypeLock:                   null;
    joinedTopicIdList:              number[];
    premiumFeatureEnabled:          boolean;
    joinedBaselineCollectionIdList: string[];
}

export interface WelcomeMessage {
    text:    string;
    enabled: boolean;
}

export interface Module {
    ranking:         Ranking;
    featured:        Featured;
    topicCategories: ExternalContent;
    catalog:         Catalog;
    chat:            Chat;
    influencer:      Influencer;
    post:            Post;
    sharedFolder:    SharedFolder;
    externalContent: ExternalContent;
}

export interface Catalog {
    privilege:       AlbumManagePrivilegeClass;
    enabled:         boolean;
    curationEnabled: boolean;
}

export interface AlbumManagePrivilegeClass {
    type:     number;
    minLevel: number;
}

export interface Chat {
    spamProtectionEnabled: boolean;
    enabled:               boolean;
    avChat:                AVChat;
    publicChat:            PublicChat;
}

export interface AVChat {
    screeningRoomEnabled: boolean;
    audioEnabled:         boolean;
    videoEnabled:         boolean;
    audio2Enabled:        boolean;
}

export interface PublicChat {
    privilege: AlbumManagePrivilegeClass;
    enabled:   boolean;
}

export interface ExternalContent {
    enabled: boolean;
}

export interface Featured {
    layout:                number;
    publicChatRoomEnabled: boolean;
    memberEnabled:         boolean;
    enabled:               boolean;
    lockMember:            boolean;
    postEnabled:           boolean;
}

export interface Influencer {
    lock:             boolean;
    maxVipNumbers:    number;
    enabled:          boolean;
    maxVipMonthlyFee: number;
    minVipMonthlyFee: number;
}

export interface Post {
    enabled:  boolean;
    postType: PostType;
}

export interface PostType {
    story:           Story;
    screeningRoom:   PublicChat;
    image:           PublicChat;
    liveMode:        PublicChat;
    question:        PublicChat;
    webLink:         Story;
    quiz:            PublicChat;
    blog:            PublicChat;
    publicChatRooms: PublicChat;
    poll:            PublicChat;
    catalogEntry:    PublicChat;
}

export interface Story {
    privilege: StoryPrivilege;
    enabled:   boolean;
}

export interface StoryPrivilege {
    type: number;
}

export interface Ranking {
    defaultLeaderboardType: number;
    enabled:                boolean;
    leaderboardList:        LeaderboardList[];
    leaderboardEnabled:     boolean;
    rankingTable:           RankingTable[];
}

export interface LeaderboardList {
    enabled: boolean;
    style:   Leaderboard1;
    type:    number;
    id:      string;
}

export interface SharedFolder {
    enabled:              boolean;
    albumManagePrivilege: AlbumManagePrivilegeClass;
    uploadPrivilege:      AlbumManagePrivilegeClass;
}

export interface Page {
    defaultList: List[];
    customList:  List[];
}

export interface List {
    originalTitle?: string;
    alias:          string;
    url:            string;
    id:             string;
    parentId?:      string;
}

export interface CommunityExtensions {
    communityNameAliases: string;
    iTagIdList:           number[];
}

export interface ThemePack {
    themeColor:        string;
    themePackHash:     string;
    themePackRevision: number;
    themePackUrl:      string;
}

export interface UserAddedTopicList {
    topicId: number;
    style:   UserAddedTopicListStyle;
    name:    string;
}

export interface UserAddedTopicListStyle {
    backgroundColor: string;
}

export interface CurrentUserInfo {
    notificationsCount: number;
    userProfile:        UserProfile;
}

export interface UserProfile {
    status:                         number;
    moodSticker:                    null;
    itemsCount:                     number;
    consecutiveCheckInDays:         null;
    uid:                            string;
    modifiedTime:                   Date;
    followingStatus:                number;
    onlineStatus:                   number;
    accountMembershipStatus:        number;
    isGlobal:                       boolean;
    avatarFrameId:                  string;
    fanClubList:                    any[];
    reputation:                     number;
    postsCount:                     number;
    avatarFrame:                    AvatarFrame;
    membersCount:                   number;
    nickname:                       string;
    mediaList:                      Array<Array<number | null | string>>;
    icon:                           string;
    isNicknameVerified:             boolean;
    mood:                           null;
    level:                          number;
    notificationSubscriptionStatus: number;
    settings:                       Settings;
    pushEnabled:                    boolean;
    membershipStatus:               number;
    content:                        string;
    joinedCount:                    number;
    role:                           number;
    commentsCount:                  number;
    ndcId:                          number;
    createdTime:                    Date;
    extensions:                     UserProfileExtensions;
    storiesCount:                   number;
    blogsCount:                     number;
}

export interface AvatarFrame {
    status:          number;
    ownershipStatus: null;
    version:         number;
    resourceUrl:     string;
    name:            string;
    icon:            string;
    frameType:       number;
    frameId:         string;
}

export interface UserProfileExtensions {
    style: UserAddedTopicListStyle;
}

export interface Settings {
    onlineStatus: number;
}
