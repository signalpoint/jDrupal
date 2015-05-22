# To run this makefile, you must have all the necessary tools installed.
#
# To install all the necessary tools, simply run the following...
#
#		 sudo make -B tools
#

# Create the list of files

files =				 src/drupal.js\
        src/includes/module.inc.js\
				src/comment.js\
				src/entity.js\
				src/file.js\
				src/node.js\
				src/taxonomy_term.js\
				src/taxonomy_vocabulary.js\
				src/user.js\
				src/services/services.js\
        src/services/services.comment.js\
				src/services/services.entity.js\
				src/services/services.file.js\
				src/services/services.node.js\
				src/services/services.system.js\
				src/services/services.taxonomy_term.js\
				src/services/services.taxonomy_vocabulary.js\
				src/services/services.user.js\

.DEFAULT_GOAL := all

# Create an aggregated js file and a compressed js file.
all: ${files}
				@echo "Generating aggregated bin/jdrupal.js file"
				@cat > bin/jdrupal.js $^

# Fix the js style on all the files.
fixjsstyle: ${files}
				fixjsstyle $^
