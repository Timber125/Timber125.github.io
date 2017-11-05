create table TABLE_USER (Username varchar(32), User_ID int(10) not null auto_increment, User_ROLE int(10) default 0, primary key (User_ID), unique index (User_ID));
create table TABLE_MESSAGES (CREATOR_ID int(10) not null, Message_ID int(10) not null auto_increment, Message_content varchar(255) not null, primary key (Message_ID));
create table Message_Viewer_Relationships (Message_ID int(10) not null, Viewer_ID int(10) not null, PK_MSG_VIEWER int(10) not null auto_increment, primary key (PK_MSG_VIEWER));
create table TABLE_ACTIVE_SESSIONS (USER_ID int(10) not null auto_increment, SESSION_TOKEN varchar(255) not null unique, primary key (USER_ID));
alter table Message_Viewer_Relationships add index FKMessage_Vi261322 (Message_ID), add constraint FKMessage_Vi261322 foreign key (Message_ID) references TABLE_MESSAGES (Message_ID);
