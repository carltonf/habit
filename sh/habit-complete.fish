function __fish_habit_no_subcommand -d 'Test if habit has sub command'
  for i in (commandline -opc)
    if contains -- $i 'edit' 'status' 'commit' 'camend'
      return 1
    end
  end
  return 0
end

function __fish_habit_list_drafts_posts -d 'List files from _drafts and _posts/'
  set draft_files $TOP/_drafts/*.md
  set post_files $TOP/_posts/*.md $TOP/_posts/*.html
  set files ''
  switch $argv
    case drafts
      set files $draft_files
    case posts
      set files $post_files
    case all
      set files $draft_files $post_files
    case '*'
      # NOTE just empty string
      return ''
  end

  # NOTE I'm using '-P' here, an experimental feature to use '\K' switch. Use
  # '-E' extended regexp to have easier reg and 'sed' is also an option.
  #
  # '-Q' can be supplied to ls to have file name quoted, which makes the output
  # uglier. Quotes should not be necessary as no whitespace is allowed in both
  # drafts and posts file names
  #
  # TODO only list most recent posts? (with arg like '-m 7')
  ls -t $files | grep -oP "$TOP/\K.*(md|html)\$"
end

# NOTE: much learned from https://github.com/docker/docker/blob/master/contrib/completion/fish/docker.fish
complete -e -c habit
# extras (maybe better to fall back to autocomplete wrapper)
for cmd in edit status commit camend
  complete -c habit -f -n '__fish_habit_no_subcommand' -a $cmd -d 'Habit Cmd'
end

# 'edit'
complete -c habit -A -f -n '__fish_seen_subcommand_from edit' -a '(__fish_habit_list_drafts_posts all)'
complete -c habit -A -f -n '__fish_seen_subcommand_from edit' -s e -l emacsclient -d 'Edit with ecn'

# NOTE 'status' options are not considered very useful, no ac for now

# 'commit'
complete -c habit -A -f -n '__fish_seen_subcommand_from commit' -a '(__fish_habit_list_drafts_posts all)'
complete -c habit -A -f -n '__fish_seen_subcommand_from commit' -s S -l stage -a 'draft post'
complete -c habit -A -f -n '__fish_seen_subcommand_from commit' -s s -l state -a 'scaffolding fledging editing polishing reviewing'
complete -c habit -A -f -n '__fish_seen_subcommand_from commit' -s p -l state_percent -a '50%'
complete -c habit -A -f -n '__fish_seen_subcommand_from commit' -s t -l title_abbr -a 'titleabbr'
complete -c habit -A -f -n '__fish_seen_subcommand_from commit' -s d -l desc -a 'description'

## habit-cwp
complete -e -c habit-cwp
complete -c habit-cwp -f -a '(__fish_habit_list_drafts_posts all)'
