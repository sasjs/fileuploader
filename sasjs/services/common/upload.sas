/**
  @file
  @brief Loads a file from frontend to a user provided location
  @details Returns a directory listing if successful

  <h4> SAS Macros </h4>
  @li mp_abort.sas
  @li mf_isdir.sas
  @li mp_dirlist.sas

**/

%mp_abort(iftrue= (%mf_isdir(&path) = 0)
  ,mac=&_program..sas
  ,msg=%str(File path (&path) is not a valid directory)
)
%global _webin_fileuri _webin_fileuri1 _webin_filename _webin_filename1;
%let infile=%sysfunc(coalescec(&_webin_fileuri1,&_webin_fileuri));
%let outfile=%sysfunc(coalescec(&_webin_filename1,&_webin_filename));
filename sjfref1 filesrvc "&infile";
data _null_;
   file "&path/&outfile";
   infile sjfref1;
   input;
   put _infile_;
run;
%mp_abort(iftrue= (&syscc ge 4)
  ,mac=&_program..sas
  ,msg=%str(Error occurred whilst reading &infile and writing to &outfile )
)
/* success - lets send back a directory listing */
%mp_dirlist(path=&path,outds=dirlist)
%webout(OPEN)
%webout(OBJ,dirlist)
%webout(CLOSE)