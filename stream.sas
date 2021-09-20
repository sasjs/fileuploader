/**
  @file
  @brief Stream the SAS 9 or Viya version
  @details Depending on server type, will execute either the SAS 9 or the Viya
  version of the fileuploader app
**/

%global sysprocessmode;
data _null_;
  mode=symget('sysprocessmode');
  if mode in ("SAS Object Server","SAS Compute Server")
  then call symputx('streamer','streamsas9.sas');
  else call symputx('streamer','streamviya.sas');
run;

filename mc url
  "https://raw.githubusercontent.com/sasjs/fileuploader/master/&streamer";
%inc mc;