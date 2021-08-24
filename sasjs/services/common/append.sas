/**
  @file
  @brief appends a file from frontend to a user provided location
  @details Returns the file size or -1 in case of error.

  <h4> SAS Macros </h4>
  @li mf_getfilesize.sas
  @li mf_isdir.sas
  @li mp_abort.sas
  @li mp_binarycopy.sas

**/

%mp_abort(iftrue= (%mf_isdir(&path) = 0)
  ,mac=&_program..sas
  ,msg=%str(File path (&path) is not a valid directory)
)

/*
  Grab the file uri. IF there are multiple, they are numbered, so
  placeholder logic is provided for convenience.
*/
%global _webin_fileuri _webin_fileuri1 _webin_filename _webin_filename1;
%let infile=%sysfunc(coalescec(&_webin_fileuri1,&_webin_fileuri));
%let outfile=%sysfunc(coalescec(&_webin_filename1,&_webin_filename));

/* read in the file from the file service */
filename filein filesrvc "&infile";
filename fileout "&path/&outfile";

%mp_binarycopy(inref=filein, outref=fileout, mode=APPEND)

%mp_abort(iftrue= (&syscc ge 4)
  ,mac=&_program..sas
  ,msg=%str(Error occurred whilst reading &infile and writing to &outfile )
)

/* success - lets create a directory listing */
data fromsas;
  filesize="%mf_getfilesize(fpath=&path/&outfile,format=yes)";
run;

/* now send it back to the frontend */
%webout(OPEN)
%webout(OBJ,fromsas)
%webout(CLOSE)
