files =				 src/core.js\
        src/includes/module.inc.js\
        src/entity.js\
				src/comment.js\
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
				src/services/services.views.js\

.DEFAULT_GOAL := all

# Create an aggregated js file and a compressed js file.
all: ${files}
				@echo "Generating aggregated jdrupal.js file"
				@cat > jdrupal.js $^
